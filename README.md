# Assembly CMS
Content Management System and apps used at http://assembly.org/

# Installation
The installation is built upon Python version 3.4+
Backwards compatibility is not tested and not supported but it probably will work mostly on Python version 2.7~

To create an optional virtual environment run `pyvenv ./env` in the *project root directory*. To activate the virtual enviroment you must run the activate-script in the ./env/Scripts/ folder. You can find further reference regarding python 3 virtual environments [here](https://docs.python.org/3/library/venv.html).

### Installation for project and required dependancies:
1. Install required packages `pip install -r requirements.txt`
2. Setup local configuration by creating a *local.py* file in *assembly/settings* `cp ./assembly/settings/local.py.template ./assembly/settings/local.py`
3. Setup your project configruation as adviced in the [configuration section](#configuration)
4. Run database migrations `python manage.py migrate`
5. Create a superuser to access the cms `python manage.py createsuperuser`
6. Setup and build frontend project `cd frontend && npm start`
6. Run the server in foreground `python manage.py runserver` or proceed to the [deployment section](#deployment)

# <a name="configuration"></a> Configuration
TODO

# <a name="deployment"></a> Deployment
TODO
