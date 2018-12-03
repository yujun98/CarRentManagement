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

public class UpdateShopServlet extends HttpServlet {
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
            String shop_number = request.getParameter("shop_number");
            String shop_city = request.getParameter("shop_city");
            String shop_name = request.getParameter("shop_name");
            String shop_address = request.getParameter("shop_address");
            String shop_phone = request.getParameter("shop_phone");
            String shop_hours = request.getParameter("shop_hours");
            String shop_area = request.getParameter("shop_area");

            if (shop_number.length() == 0) {
                shop_number = null;
            }
            if (shop_city.length() == 0) {
                shop_city = null;
            }
            if (shop_area.length() == 0) {
                shop_area = null;
            }
            if (shop_name.length() == 0) {
                shop_name = null;
            }
            if (shop_address.length() == 0) {
                shop_address = null;
            }
            if (shop_phone.length() == 0) {
                shop_phone = null;
            }
            if (shop_hours.length() == 0) {
                shop_hours = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car_rent.shop set shop_city = ?, shop_name = ?, shop_address = ?, shop_phone = ?, shop_hours = ?, shop_area = ? where shop_number = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, shop_city);
            ps.setString(2, shop_area);
            ps.setString(3, shop_name);
            ps.setString(4, shop_address);
            ps.setString(5, shop_phone);
            ps.setString(6, shop_hours);
            ps.setString(7, shop_number);
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
