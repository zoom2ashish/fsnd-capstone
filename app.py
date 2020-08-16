"""A Python Flask REST API BoilerPlate (CRUD) Style"""

import argparse
import os
from dotenv import load_dotenv
from backend import create_app

load_dotenv()

APP = create_app()

if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(
        description="Casting Agency - FSND Capstone app")

    PARSER.add_argument('--debug', action='store_true',
                        help="""Use flask debug/dev mode with file
                        change reloading""")
    ARGS = PARSER.parse_args()

    PORT = int(os.environ.get('PORT', 5000))

    if ARGS.debug:
        print("Running in debug mode")
        APP.run(host='0.0.0.0', port=PORT, debug=True)
    else:
        APP.run(host='0.0.0.0', port=PORT, debug=False)
