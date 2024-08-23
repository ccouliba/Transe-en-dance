
import os
from dotenv import load_dotenv
	
def load_env(path: str):

	if not os.path.exists(path):
		raise FileNotFoundError(f"No .env file found at {path}")

	load_dotenv(path)
  