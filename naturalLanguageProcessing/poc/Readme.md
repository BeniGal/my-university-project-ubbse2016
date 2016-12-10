### Setting up the environment

Make sure you have python 2.7 or 3.2+ installed.

Make sure you have `pip` installed:
```sh
sudo apt-get install python-pip
```

Then install the nltk library and other dependencies
```sh
pip install -U nltk
pip install numpy
```

Then enter the python interpretter:
```sh
python
```

Type in the following commands:
```python
import nltk
nltk.download()
```

Download all the packages (because reasons) (`d` -> enter -> `all` -> enter)
The whole dataset is around 2.5GB, so this will take some time.

### Running the tests

```sh
python test.py
```

To save you from the trouble of running this, you can check the test results out in `results.txt`
