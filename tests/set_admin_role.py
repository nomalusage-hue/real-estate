import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("/home/kingofprograming/Downloads/realestates-eec2e-firebase-adminsdk-fbsvc-607e85cddb.json")
firebase_admin.initialize_app(cred)

def set_admin_role(email):
    user = auth.get_user_by_email(email)
    auth.set_custom_user_claims(user.uid, {'role': 'admin'})
    print(f"Custom claim 'admin' set for {email}")

# Example usage
set_admin_role("boutrosgerges8@gmail.com")