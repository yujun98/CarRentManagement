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

public class UpdateOrderServlet extends HttpServlet {
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
            String order_number = request.getParameter("order_number");
            String user_phone = request.getParameter("user_phone");
            String car_number = request.getParameter("car_number");
            String take_shop = request.getParameter("take_shop");
            String return_shop = request.getParameter("return_shop");
            String take_time = request.getParameter("take_time");
            String return_time = request.getParameter("return_time");
            int order_amount = Integer.parseInt(request.getParameter("order_amount"));
            String order_state = request.getParameter("order_state");
            int take_oil = Integer.parseInt(request.getParameter("take_oil"));
            int return_oil = Integer.parseInt(request.getParameter("return_oil"));
            int oil_amount = Integer.parseInt(request.getParameter("oil_amount"));
            String order_time = request.getParameter("order_time");

            if (order_number.length() == 0) {
                order_number = null;
            }
            if (user_phone.length() == 0) {
                user_phone = null;
            }
            if (car_number.length() == 0) {
                car_number = null;
            }
            if (take_shop.length() == 0) {
                take_shop = null;
            }
            if (return_shop.length() == 0) {
                return_shop = null;
            }
            if (take_time.length() == 0) {
                take_time = null;
            }
            if (return_time.length() == 0) {
                return_time = null;
            }
            if (order_state.length() == 0) {
                order_state = null;
            }
            if (order_time.length() == 0) {
                order_time = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car_rent.order_info set user_phone = ?, car_number = ?, take_shop = ?, return_shop = ?, take_time = ?, return_time = ?, order_amount = ?, order_state = ?, take_oil = ?, return_oil = ?, oil_amount = ?, order_time = ? where order_number = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, user_phone);
            ps.setString(2, car_number);
            ps.setString(3, take_shop);
            ps.setString(4, return_shop);
            ps.setString(5, take_time);
            ps.setString(6, return_time);
            ps.setInt(7, order_amount);
            ps.setString(8, order_state);
            ps.setInt(9, take_oil);
            ps.setInt(10, return_oil);
            ps.setInt(11, oil_amount);
            ps.setString(12, order_time);
            ps.setString(13, order_number);
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
