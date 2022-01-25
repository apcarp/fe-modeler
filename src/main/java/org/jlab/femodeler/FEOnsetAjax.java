package org.jlab.femodeler;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.stream.Collectors;

@WebServlet(name = "FEOnsetAjax", urlPatterns = {"/ajax/fe-onsets"})
public class FEOnsetAjax extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String jsonString;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(getServletContext()
                .getResourceAsStream("/WEB-INF/cfg/fe-onsets.json")))) {
            jsonString = br.lines().collect(Collectors.joining(""));
        }
        try (PrintWriter pw = response.getWriter()) {
            response.setContentType("application/json");
            pw.write(jsonString);
        }
    }
}
