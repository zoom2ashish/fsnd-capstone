import datetime

def isValidDateTime(timestamp):
  try:
    datetime.datetime.fromtimestamp(timestamp)
    return True
  except:
    return False
