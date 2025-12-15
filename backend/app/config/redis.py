import os
import logging
from redis import Redis, ConnectionPool
from app.config.config import settings
from typing import Optional

logger = logging.getLogger("petroanalytics.redis")

class RedisConfig:
    _instance: Optional[Redis] = None
    _pool: Optional[ConnectionPool] = None
    
    @classmethod
    def get_redis(cls) -> Redis:
        """Singleton para conexão Redis com connection pooling"""
        if cls._instance is None:
            redis_url = settings.REDIS_URL
            
            cls._pool = ConnectionPool.from_url(
                redis_url,
                decode_responses=True,
                max_connections=10,           
                socket_connect_timeout=2,    
                socket_timeout=2,           
                socket_keepalive=True,
                retry_on_timeout=True,      
                health_check_interval=30
            )
            
            cls._instance = Redis(connection_pool=cls._pool)
            
            try:
                cls._instance.ping()
                logger.info("Redis connected successfully")
            except Exception as e:
                logger.error(f"Redis connection failed: {e}")
        
        return cls._instance

redis_client = RedisConfig.get_redis()
