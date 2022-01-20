package org.jlab.femodeler;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

@WebServlet(name = "CAGetAjax", urlPatterns = {"/ajax/caget"})
public class CAGetAjax extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {


        Properties prop = new Properties();
        try (InputStream input = getServletContext().getResourceAsStream("/WEB-INF/cfg/fe-modeler.properties")) {
            prop.load(input);
        }

        String e2wResponse;
        HttpsURLConnection con = null;
        try {
            String urlString = prop.getProperty("epics2web.url");
            if (!request.getParameterMap().entrySet().isEmpty()) {
                urlString += "?" + getParamsString(request.getParameterMap());
            }
            URL url = new URL(urlString);
            con = (HttpsURLConnection) url.openConnection();
            con.setDoOutput(false);
            con.setRequestMethod("GET");
            con.setRequestProperty("Accept-Charset", "UTF-8");

            try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                e2wResponse = br.lines().collect(Collectors.joining(""));
            }
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }

        try (PrintWriter pw = response.getWriter()) {
            response.setContentType("application/json");
            pw.write(e2wResponse);
        }

    }

    private String getParamsString(Map<String, String[]> params) throws UnsupportedEncodingException {
        StringBuilder results = new StringBuilder();

        for (Map.Entry<String, String[]> entry : params.entrySet()) {
            for (String val : entry.getValue()) {
                results.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
                results.append("=");
                results.append(URLEncoder.encode(val, StandardCharsets.UTF_8));
                results.append("&");
            }
        }

        // Get the string and strip off the last '&' if we generated a non-zero length string.
        String resultString = results.toString();
        return resultString.length() > 0 ? resultString.substring(0, resultString.length() - 1) : resultString;
    }
}
