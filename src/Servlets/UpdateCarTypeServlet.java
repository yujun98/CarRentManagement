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

public class UpdateCarTypeServlet extends HttpServlet {
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
            String car_name = request.getParameter("car_name");
            String car_brand = request.getParameter("car_brand");
            String car_type = request.getParameter("car_type");
            String daily_rent = request.getParameter("daily_rent");
            String car_deposit = request.getParameter("car_deposit");

            if (car_name.length() == 0) {
                car_name = null;
            }
            if (car_brand.length() == 0) {
                car_brand = null;
            }
            if (car_type.length() == 0) {
                car_type = null;
            }
            if (daily_rent.length() == 0) {
                daily_rent = null;
            }
            if (car_deposit.length() == 0) {
                car_deposit = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car_rent.car_type set car_brand = ?, car_type = ?, daily_rent = ?, car_deposit = ? where car_name = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_brand);
            ps.setString(2, car_type);
            ps.setString(3, daily_rent);
            ps.setString(4, car_deposit);
            ps.setString(5, car_name);
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
