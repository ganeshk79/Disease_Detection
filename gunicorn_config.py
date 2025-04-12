import multiprocessing

# Number of workers
workers = 1  # Keep single worker to minimize memory usage
worker_class = 'sync'
worker_connections = 1000
timeout = 120  # Increased timeout to 120 seconds
keepalive = 2

# Memory settings
max_requests = 100
max_requests_jitter = 20
worker_tmp_dir = "/dev/shm"  # Use shared memory for temporary files

# Process naming
proc_name = 'skin_disease_app'

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Server mechanics
bind = '0.0.0.0:10000'
preload_app = True  # Preload the application to share memory between workers

# Worker settings
graceful_timeout = 120
max_worker_lifetime = 1800  # Restart workers every 30 minutes
worker_max_requests = 100  # Restart workers after 100 requests 