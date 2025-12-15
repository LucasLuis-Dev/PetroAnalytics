import os
import logging
from redis import Redis
from app.config.config import settings
from typing import Optional

logger = logging.getLogger("petroanalytics.redis")

class RedisConfig:
    _instance: Optional[Redis] = None
    
    @classmethod
    def get_redis(cls) -> Redis:
        """Singleton para conexão Redis"""
        if cls._instance is None:
            redis_url = settings.REDIS_URL
            
            cls._instance = Redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_keepalive=True,
                health_check_interval=30
            )
            logger.info(
                f"✅ Redis configurado: {redis_url}"
            )
        
        return cls._instance

# Exporta instância
redis_client = RedisConfig.get_redis()
