# Assembly CMS
Content Management System and apps used at http://assembly.org/

# Installation
The installation is built upon Python version 3.4+
Backwards compatibility is not tested and not supported but it probably will work mostly on Python version 2.7~

To create an optional virtual environment run `pyvenv ./env` in the *project root directory*.
To activate the virtual environment you must run the activate-script in the ./env/Scripts/ folder.
You can find further reference regarding python 3 virtual environments [here](https://docs.python.org/3/library/venv.html).

### Installation for project and required dependencies:

# <a name="vagrant-setup"></a>Vagrant Setup

The vagrant provision will install all required dependencies. See *scripts*-folder for more information.
The default box configured is the latest Hashicorp provided Ubuntu 64-bit with 1024 MB configured RAM.

> By default the vagrant box will forward port 8000 used by the Django server to your local port 8080. You can
configure this in the Vagrantfile if you need to change it.

1. Install [Vagrant](https://docs.vagrantup.com/v2/installation/index.html)
   * Supported providers by the default box are:
     * VirtualBox
     * Hyper-V
     * VMware
2. Start vagrant by running `vagrant up` at project root
3. Connect to the vagrant box `vagrant ssh`
4. Start development environment `./run-dev.sh`. This will start two screen instances: *gulp* and *django*

# <a name="manual-install"></a> Manual Installation
1. Install required packages `pip install -r requirements.txt`
2. Setup local configuration by creating a *local.py* file in *assembly/settings* `cp ./assembly/settings/local.py.template ./assembly/settings/local.py`
3. Setup your project configuration as advised in the [configuration section](#configuration)
4. Run database migrations and insert initial_data from core/fixtures `python manage.py bootstrap`
5. Create a superuser to access the cms `python manage.py createsuperuser`
6. Setup and build frontend project `cd frontend && npm start`
7. Run the server in foreground `python manage.py runserver` or proceed to the [deployment section](#deployment)

# <a name="configuration"></a> Configuration
TODO

# <a name="deployment"></a> Deployment
TODO
