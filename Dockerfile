FROM jboss/wildfly:16.0.0.Final
ADD ./dockerWarVolume/fe-modeler.war /opt/jboss/wildfly/standalone/deployments/
