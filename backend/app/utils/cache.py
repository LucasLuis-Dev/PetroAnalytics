import json
import hashlib
import logging
import asyncio
from functools import wraps
from typing import Callable
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from app.config.redis import redis_client
from app.config.config import settings

logger = logging.getLogger("petroanalytics.cache")

def cache_response(key_prefix: str, ttl: int = 300):
    """
    Args:
        key_prefix: Prefixo da chave no Redis
        ttl: Tempo de vida em segundos (padrão: 5 minutos)
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs): 
            if not settings.ENABLE_REDIS or redis_client is None:
                logger.debug(f"Cache disabled for {func.__name__}")
                if asyncio.iscoroutinefunction(func):
                    return await func(*args, **kwargs)
                else:
                    return func(*args, **kwargs)
   
            cache_params = {
                k: v for k, v in kwargs.items() 
                if not isinstance(v, Session) and k not in ['db', 'current_user']
            }
            
            param_hash = hashlib.md5(
                json.dumps(cache_params, sort_keys=True, default=str).encode()
            ).hexdigest()
            cache_key = f"{key_prefix}:{param_hash}"
            
            try:
                cached = redis_client.get(cache_key)
                if cached:
                    logger.info(f"Cache hit prefix={key_prefix} hash={param_hash}")
                    return json.loads(cached)
            except Exception as e:
                logger.warning(f"Cache read error prefix={key_prefix} error={str(e)}")
            
            logger.info(f"Cache miss prefix={key_prefix} hash={param_hash} function={func.__name__}")
            
            if asyncio.iscoroutinefunction(func):
                result = await func(*args, **kwargs)
            else:
                result = func(*args, **kwargs)
            
            try:
                json_compatible = jsonable_encoder(result)
                redis_client.setex(
                    cache_key,
                    ttl,
                    json.dumps(json_compatible)
                )
                logger.info(f"Cache saved prefix={key_prefix} hash={param_hash} ttl={ttl}s")
            except Exception as e:
                logger.error(f"Cache write error prefix={key_prefix} error={str(e)}")
            
            return result
        
        return wrapper
    return decorator
