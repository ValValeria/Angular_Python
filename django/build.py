from os.path import isfile
import subprocess
import os
import shutil
import sys

def locate_file(file,dest_path,address):
    ext = os.path.splitext(file)[1];

    folders = {"js": [".js", ".js.map",".map"],"css": [".css"]}
    all_exten = [];

    for val in folders.values():
        all_exten.extend(val)

    for key, value in folders.items():
        if not ext in all_exten:
           key="assets";

        dest_dir = os.path.join(dest_path, key)
        dest_file = os.path.join(dest_dir, file)

        if os.path.exists(dest_file):
            os.remove(dest_file)

        build_file = os.path.join(address, file)
        
        if os.path.exists(build_file):
           shutil.copy(build_file, dest_file)


def task_all():
    setting_path = os.path.abspath('./DjangoWebProject/other_settings.py')

    if os.path.exists(setting_path) and os.path.isfile(setting_path):
        lines = ['DEBUG = False \n',
                 'ALLOWED_HOSTS = ["radiant-earth-56780.herokuapp.com","127.0.0.1:8000"]\n']
        other_lines = ['DEBUG = True \n', 'ALLOWED_HOSTS = []\n']

        with open(setting_path, 'wt') as file:
            file.writelines(lines)

            commands = [
                'git add .', 'git commit -m "make it better"', 'git push heroku master']

            current_dir = "./"

            for com in commands:
                obj = subprocess.run(
                    "cmd /c chdir {} & {}".format(current_dir, com))

                if obj.returncode == 0:
                    print(">>> Success")

            file.writelines(other_lines)
            print(">> Done!")


def set_up():
    path = '../shop'
    abs_path = os.path.abspath(path)

    if os.access(abs_path, os.R_OK):
        command = "cmd /c chdir {} {}".format(path, "& npm run build")
        subprocess.call(command)
        build_path = os.path.join(abs_path, "dist","shop")

        if os.path.exists(build_path):
            dest_path = os.path.abspath("app\\static")
            walk = os.walk(build_path)
            
            def walk_func(walk_obj):
                for address, dirs, files in walk_obj:
                   for file in files:
                      locate_file(file,dest_path,address) 

            walk_func(walk)

            arg = sys.argv[1] if len(sys.argv) > 1 else '';

            if arg == "all":
                task_all()
            else:
                print(">> Done!")
        else:
            print(">> The folder \\shop\\dist doesn't exist")
    else:
        raise FileExistsError(abs_path)


if __name__ == "__main__":
    set_up()
