package org.jlab.femodeler;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.stream.Collectors;

/*
This is a simple mock up of the epics2web/caget endpoint.  It alwasy returns the static response held in the referenced
JSON file.
 */
@WebServlet(name = "Epics2WebAjax", urlPatterns = {"/ajax/epics2web"})
public class Epics2WebAjax extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String jsonString;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(getServletContext()
                .getResourceAsStream("/WEB-INF/cfg/pvs.json")))) {
            jsonString = br.lines().collect(Collectors.joining(""));
        }
        try (PrintWriter pw = response.getWriter()) {
            response.setContentType("application/json");
            pw.write(jsonString);
        }
    }
}
