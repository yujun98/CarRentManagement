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

public class AddCarTypeServlet extends HttpServlet {
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
            float daily_rent = Float.parseFloat(request.getParameter("daily_rent"));
            float car_deposit = Float.parseFloat(request.getParameter("car_deposit"));

            Connection conn = DatabaseInit.getConnection();
            String sql = "insert into car.car_type(car_name, car_brand, car_type, daily_rent, car_deposit) values (?, ?, ?, ?, ?);";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_name);
            ps.setString(2, car_brand);
            ps.setString(3, car_type);
            ps.setFloat(4, daily_rent);
            ps.setFloat(5, car_deposit);
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
