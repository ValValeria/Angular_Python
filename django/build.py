from os.path import isfile
import subprocess;
import os;
import shutil;
import sys;


def set_up():
    path = '../shop';
    abs_path = os.path.abspath(path)

    if os.access(abs_path,os.R_OK):
       command = "cmd /c chdir {} {}".format(path,"& npm run build");
       subprocess.call(command);
       build_path = os.path.join(abs_path,"dist");

       if os.path.exists(build_path):
           dest_path = os.path.abspath("app\\static")
           tree = os.path.join(dest_path,"dist");
           
           if os.path.exists(tree):
               shutil.rmtree(tree)

           shutil.move(build_path,dest_path)   

           arg = sys.argv[1] if len(sys.argv)>1 else '';

           if arg == "all":
               setting_path = os.path.abspath('./DjangoWebProject/other_settings.py')

               if os.path.exists(setting_path) and os.path.isfile(setting_path):
                   lines = ['DEBUG = False \n','ALLOWED_HOSTS = ["radiant-earth-56780.herokuapp.com","127.0.0.1:8000"]\n'];
                   other_lines = ['DEBUG = True \n','ALLOWED_HOSTS = []\n'];

                   with open(setting_path,'wt') as file:           
                        file.writelines(lines)

                        commands = ['git add .', 'git commit -m "make it better"', 'git push heroku master'];
                      
                        current_dir = "./"

                        for com in commands:
                            obj = subprocess.run("cmd /c chdir {} & {}".format(current_dir,com))

                            if obj.returncode == 0:
                                print(">>> Success")
                        
                        file.writelines(other_lines)                        
                        print(">> Done!");
           else:
               print(">> Done!")            
       else:
           print(">> Something bad has happened")
    else:
       raise FileExistsError(abs_path)



if __name__ == "__main__":
    set_up();