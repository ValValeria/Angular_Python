from os.path import isfile
import subprocess;
import os;
import shutil;


def set_up():
    path = '\\Users\\User\\source\\repos\\DjangoWebProject\\DjangoWebProject\\angular\\shop';
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
           print(">> Done!")            
       else:
           print(">> Something bad has happened")
    else:
       raise FileExistsError(abs_path)

if __name__ == "__main__":
    set_up();