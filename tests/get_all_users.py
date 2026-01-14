import firebase_admin
from firebase_admin import auth, credentials

# Initialize Firebase Admin
cred = credentials.Certificate("/home/kingofprograming/Downloads/realestates-eec2e-firebase-adminsdk-fbsvc-607e85cddb.json")
firebase_admin.initialize_app(cred)

def list_admins():
    # Pagination: get_users returns up to 1000 users at a time
    page = auth.list_users()
    
    while page:
        for user in page.users:
            claims = user.custom_claims or {}
            # if claims.get('role') == 'admin':
            print(f"Admin: {user.email} | UID: {user.uid}", claims)
        # Move to next page
        page = page.get_next_page()

if __name__ == "__main__":
    list_admins()
