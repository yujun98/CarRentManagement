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

public class AddOrderServlet extends HttpServlet {
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
            float order_amount;
            String order_state = request.getParameter("order_state");
            float take_oil;
            float return_oil;
            float oil_amount;
            String order_time = request.getParameter("order_time");

            if (return_time.length() == 0) {
                return_time = null;
            }
            if (request.getParameter("order_amount").length() == 0) {
                order_amount = 0;
            }
            else {
                order_amount = Float.parseFloat(request.getParameter("order_amount"));
            }
            if (request.getParameter("take_oil").length() == 0) {
                take_oil = 0;
            }
            else {
                take_oil = Float.parseFloat(request.getParameter("take_oil"));
            }
            if (request.getParameter("return_oil").length() == 0) {
                return_oil = 0;
            }
            else {
                return_oil = Float.parseFloat(request.getParameter("return_oil"));
            }
            if (request.getParameter("oil_amount").length() == 0) {
                oil_amount = 0;
            }
            else {
                oil_amount = Float.parseFloat(request.getParameter("oil_amount"));
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "insert into car.order_info(order_number, user_phone, car_number, take_shop, return_shop, take_time, return_time, order_amount, order_state, take_oil, return_oil, oil_amount, order_time) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, order_number);
            ps.setString(2, user_phone);
            ps.setString(3, car_number);
            ps.setString(4, take_shop);
            ps.setString(5, return_shop);
            ps.setString(6, take_time);
            ps.setString(7, return_time);
            ps.setFloat(8, order_amount);
            ps.setString(9, order_state);
            ps.setFloat(10, take_oil);
            ps.setFloat(11, return_oil);
            ps.setFloat(12, oil_amount);
            ps.setString(13, order_time);
            ps.executeUpdate();

            String specialSql = "update car.car set car_state = ? where car_number = ?";
            PreparedStatement specialPs = conn.prepareStatement(specialSql);
            specialPs.setString(2, car_number);
            if (order_state.equals("未取车") || order_state.equals("未还车")) {
                specialPs.setString(1, "已租");
            }
            else {
                specialPs.setString(1, "未租");
            }
            specialPs.executeUpdate();
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
