import datetime

def isValidDateTimeInSeconds(timestamp_in_seconds):
  try:
    datetime.datetime.fromtimestamp(timestamp_in_seconds)
    return True
  except:
    return False
