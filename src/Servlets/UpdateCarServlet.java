package Servlets;

import Classes.DatabaseInit;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class UpdateCarServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        String json;
        PrintWriter out = response.getWriter();

        try {
            String car_number = request.getParameter("car_number");
            String plate_number = request.getParameter("plate_number");
            String car_name = request.getParameter("car_name");
            String car_state = request.getParameter("car_state");
            String shop_number = request.getParameter("shop_number");

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car.car set plate_number = ?, car_name = ?, car_state = ?, shop_number = ? where car_number = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, plate_number);
            ps.setString(2, car_name);
            ps.setString(3, car_state);
            ps.setString(4, shop_number);
            ps.setString(5, car_number);
            ps.executeUpdate();
        } catch (Exception e) {
            json = "{\"code\": \"1\"}";
            out.println(JSONObject.fromObject(json));
            out.close();
            e.printStackTrace();
        }

        json = "{\"code\": \"0\"}";
        out.println(JSONObject.fromObject(json));
        out.close();
    }
}
