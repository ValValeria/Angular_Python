class UserParser:
    def __init__(self,user):
        self.__user = user
    
    def get_user(self):
        avatar = None;

        try:
           avatar = self.user.avatar.photo.url;
        except:  
           avatar ="/app/static/avatars/blank.jpg";

        data={
            "email":self.__user.email,
            "password":self.__user.password,
            "avatar": avatar,
            "role":self.__user.userdata.status,
            "id":self.__user.id,
        }

        return data