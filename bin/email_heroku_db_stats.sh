#!/bin/bash

# Report will contain:
# 1. # of users.
# 2. # of streets.
# 3. # of default streets (undoStack.length == 0).
# 4. DB storage size in MB.
# 5. DB storage utilization in %.

# Constants
let LOG_LEVEL_DEBUG=10
let LOG_LEVEL_INFO=20
let LOG_LEVEL_ERROR=30

# Functions

function log_debug { if [ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ]; then printf "[DEBUG] %s\n" "$@"; fi; }
function log_info  { if [ $LOG_LEVEL -le $LOG_LEVEL_INFO  ]; then printf "[INFO]  %s\n" "$@"; fi;  }
function log_error { if [ $LOG_LEVEL -le $LOG_LEVEL_ERROR ]; then printf "[ERROR] %s\n" "$@"; fi;  }

function query {

  mongo \
    --quiet \
    --username $mongo_username \
    --password $mongo_password \
    $mongo_host_port_db \
    --eval "$@"

}

# Main

LOG_LEVEL=$(echo $LOG_LEVEL | tr [:upper:] [:lower:])
case $LOG_LEVEL in
    debug)
        let LOG_LEVEL=$LOG_LEVEL_DEBUG
        ;;
    error)
        let LOG_LEVEL=$LOG_LEVEL_ERROR
        ;;
    *)
        let LOG_LEVEL=$LOG_LEVEL_INFO
        ;;
esac

heroku_app_name=$1
if [ -z "$heroku_app_name" ]; then
    heroku_app_name="streetmix-api-v2"
fi

mongo_url=$(heroku config:get MONGOHQ_URL --app $heroku_app_name)

mongo_username=$(echo "$mongo_url" | awk -F':' '{print $2}' | awk -F'/' '{print $3}')
mongo_password=$(echo "$mongo_url" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
mongo_host_port_db=$(echo "$mongo_url" | awk -F'@' '{print $2}')

log_debug "mongo_username = $mongo_username"
log_debug "mongo_password = $mongo_password"
log_debug "mongo_host_port_db = $mongo_host_port_db"

let number_of_users=$(query "db.users.count()")
let number_of_streets=$(query "db.streets.count()")
let number_of_default_streets=$(query "db.streets.count({ \"data.undoStack\" : { \$size: 0 }})")
let db_storage_size_bytes=$(query "db.stats().storageSize")

db_storage_size_mb=$(echo "scale=2; $db_storage_size_bytes/(1000 * 1000)" | bc)
db_storage_utilization_percent=$(echo "scale=2; $db_storage_size_bytes*100/(512*1000*1000)" | bc)

subject="Database stats for $heroku_app_name"
body="$(cat <<EOF 

# of users = $number_of_users
# of streets = $number_of_streets
# of default streets = $number_of_default_streets
DB storage size (MB) = $db_storage_size_mb
DB storage utlization = $db_storage_utilization_percent%

EOF
)
"

subject=${subject// /%20}
body=${body// /%20}
body=${body//$'\n'/%0D%0A}
body=${body//=/%3D}
body=${body//#/%23}

curlCall="https://sendgrid.com/api/mail.send.json?api_user=$SENDGRID_USERNAME&api_key=$SENDGRID_PASSWORD&to=shaunak@codeforamerica.org&from=shaunak@codeforamerica.org&subject=$subject&text=$body"

curl -s "$curlCall" >/dev/null