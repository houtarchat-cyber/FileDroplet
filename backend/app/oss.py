import base64
import datetime
import hmac
import json
import os
import time
import uuid
from hashlib import sha1

from dotenv import load_dotenv

load_dotenv()

# 从环境变量获取 OSS 的配置
ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID")
ACCESS_KEY_SECRET = os.getenv("ACCESS_KEY_SECRET")
BUCKET_NAME = os.getenv("BUCKET_NAME")
ENDPOINT = os.getenv("ENDPOINT")

expiration = 30


def generate_signature():
    expire_syncpoint = int(time.time()) + expiration
    expire = (
        datetime.datetime.fromtimestamp(expire_syncpoint).isoformat().split(".")[0]
        + "Z"
    )

    key = str(uuid.uuid4()) + "-"

    policy_dict = {
        "expiration": expire,
        "conditions": [["starts-with", "$key", "file_droplet/" + key]],
    }
    policy = json.dumps(policy_dict).strip()
    policy_encode = base64.b64encode(policy.encode()).decode()
    h = hmac.new(ACCESS_KEY_SECRET.encode(), policy_encode.encode(), sha1)
    sign_result = base64.b64encode(h.digest()).decode()

    return {
        "access_key_id": ACCESS_KEY_ID,
        "host": f"https://{BUCKET_NAME}.{ENDPOINT}",
        "policy": policy_encode,
        "signature": sign_result,
        "bucket": BUCKET_NAME,
        "expire": expire,
        "dir": "file_droplet/",
        "key": key,
    }
