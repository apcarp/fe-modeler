<%--
  Created by IntelliJ IDEA.
  User: adamc
  Date: 12/14/2021
  Time: 7:11 PM
  To change this template use File | Settings | File Templates.
--%>
<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
    <title>FE Modeler - NL C100s</title>
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/resources/v${initParam.resourceVersionNumber}/css/main.css">
</head>
<body>
<h1>NL NDX Modelers</h1>
<h2>Inputs</h2>
<form id="model-inputs" title="Inputs">
    <div id="model-inputs-panel"></div>
</form>
<h2>Errors</h2>
<div class="error-message-box" id="error-banner">
</div>
<h2>Outputs</h2>
<div id="results-panel">
    <table>
        <tr>
            <th></th>
            <th>1L22</th>
            <th>1L23</th>
            <th>1L24</th>
            <th>1L25</th>
            <th>1L26</th>
            <th>1L27</th>
        </tr>
        <tr>
            <td>Neutron</td>
            <td id="n-pred-1"></td>
            <td id="n-pred-2"></td>
            <td id="n-pred-3"></td>
            <td id="n-pred-4"></td>
            <td id="n-pred-5"></td>
            <td id="n-pred-6"></td>
        </tr>
        <tr>
            <td>Gamma</td>
            <td id="g-pred-1"></td>
            <td id="g-pred-2"></td>
            <td id="g-pred-3"></td>
            <td id="g-pred-4"></td>
            <td id="g-pred-5"></td>
            <td id="g-pred-6"></td>
        </tr>
    </table>


    <div class="chart-panel">
        <div class="zone-panel">
            <div class="zone-panel-title">1L22</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L22-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L22-neutron-chart"></canvas>
            </div>
            <div class="cm-gradient-panel">
                <canvas class="cm-gradient-plot" id="1L22-gradient-chart"></canvas>
            </div>
        </div>

        <div class="zone-panel">
            <div class="zone-panel-title">1L23</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L23-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L23-neutron-chart"></canvas>
            </div>
            <div class="cm-gradient-panel">
                <canvas class="cm-gradient-plot" id="1L23-gradient-chart"></canvas>
            </div>
        </div>

        <div class="zone-panel">
            <div class="zone-panel-title">1L24</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L24-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L24-neutron-chart"></canvas>
            </div>
            <div class="cm-gradient-panel">
                <canvas class="cm-gradient-plot" id="1L24-gradient-chart"></canvas>
            </div>
        </div>
        <div class="zone-panel">
            <div class="zone-panel-title">1L25</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L25-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L25-neutron-chart"></canvas>
            </div>
            <div class="cm-gradient-panel">
                <canvas class="cm-gradient-plot" id="1L25-gradient-chart"></canvas>
            </div>
        </div>
        <div class="zone-panel">
            <div class="zone-panel-title">1L26</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L26-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L26-neutron-chart"></canvas>
            </div>
        </div>
        <div class="zone-panel">
            <div class="zone-panel-title">1L27</div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L27-gamma-chart"></canvas>
            </div>
            <div class="ndx-panel">
                <canvas class="ndx-plot" id="1L27-neutron-chart"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Set any important configuration info here that needs to come from the servelet -->
<script>
    var jlab = jlab || {};
    jlab.contextPath = '<c:out value = "${pageContext.request.contextPath}"/>';
</script>
<!-- import ONNXRuntime Web from CDN.  Alternative is to use node.js and it's build tools -->
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="module"
        src="${pageContext.request.contextPath}/resources/v${initParam.resourceVersionNumber}/js/main.js"></script>
</body>
</html>