""" DateTime Utils """

import datetime


def isValidDateTimeInSeconds(timestamp_in_seconds):
    """ Validates if give timestamp is valid epoch time """
    try:
        datetime.datetime.fromtimestamp(timestamp_in_seconds)
        return True
    except Exception:
        return False
