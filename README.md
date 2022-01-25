# FE-Modeler

A simple software tool for interacting with models field emission related radiation versus cavity gradients and FE onsets.  Current model supports only cryomodules 1L22 - 1L25.

## To build

On Windows or Linux

```
git clone https://github.com/apcarp/fe-modeler.git
cd fe-modeler
./gradlew build
docker-compose up
```

Then navigate to http://localhost:8080/fe-modeler/model-controls in a browser.  This app does link against several external javascript dependencies.

## Configuration

There is are several configuration and data files that can affect the behavior of the app.

- src/main/webapp/WEB-INF/cfg/fe-modeler.properties
  - This contains the url of the epics2web/caget endpoint where the R...ODVH and R...GSET PVs will be queried
- src/main/webapp/WEB-INF/cfg/fe-onsets.json
  - This is the JSON file containing the field emission onsets that are returned from /fe-modeler/ajax/fe-onsets
- src/main/webapp/WEB-INF/cfg/pvs.json
  - This is the JSON file containing a mock epics2web/caget response that is handed out by /fe-modeler/ajax/epics2web.  This endpoint can be used as a mock up response should a real epics2web installation not be available.  Configured in fe-modeler.properties.
