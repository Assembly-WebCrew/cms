#!/usr/bin/env bash
apt-get update
apt-get install -y python3 python3-dev postgresql libpq-dev nginx make git libjpeg-dev libxml2-dev libxslt1-dev screen curl
curl -sL https://deb.nodesource.com/setup_5.x | bash -
apt-get install -y nodejs

npm install -g npm
npm install -g gulp bower

su -c "createuser -s root" postgres
su -c "createdb -O root root" postgres
createuser -s vagrant
createdb -O vagrant vagrant
psql -c "CREATE USER asmweb WITH PASSWORD 'asmweb';"
createdb -O asmweb asmweb

if ! [ -e /usr/bin/python3.5 ]; then
    wget https://www.python.org/ftp/python/3.5.1/Python-3.5.1.tar.xz
    tar xfvJ Python-3.5.1.tar.xz
    cd Python-3.5.1
    ./configure --prefix=/opt/python3.5
    make
    make install
    ln -fs /opt/python3.5/bin/python3 /usr/bin/python3
    ln -fs /opt/python3.5/bin/pip3 /usr/bin/pip3
    ln -fs /opt/python3.5/bin/pyvenv /usr/bin/pyvenv
    cd ..
    rm -rf Python-3.5.1
    rm Python-3.5.1.tar.xz
fi

if ! [ -e /vagrant/env ]; then
    pyvenv /vagrant/env
fi

cd /vagrant
source env/bin/activate
pip install -r requirements.txt --upgrade
python manage.py migrate
deactivate
chmod +x /vagrant/scripts/gulp.sh
chmod +x /vagrant/scripts/django.sh
chmod +x /vagrant/scripts/run-dev.sh
chmod +x /vagrant/scripts/import-database.sh
ln -fs /vagrant/scripts/run-dev.sh /home/vagrant
ln -fs /vagrant/scripts/import-database.sh /home/vagrant
