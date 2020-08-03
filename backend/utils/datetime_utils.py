import datetime

def isValidDateTime(timestamp):
  try:
    timestamp_in_seconds = timestamp / 1000
    datetime.datetime.fromtimestamp(timestamp_in_seconds)
    return True
  except:
    return False
