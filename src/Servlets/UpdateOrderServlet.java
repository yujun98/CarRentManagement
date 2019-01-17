package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

//更新订单记录的 Servlet
public class UpdateOrderServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        PrintWriter out = response.getWriter();

        try {
            String order_number = request.getParameter("order_number");
            String user_phone = request.getParameter("user_phone");
            String car_number = request.getParameter("car_number");
            String take_shop = request.getParameter("take_shop");
            String return_shop = request.getParameter("return_shop");
            String take_time = request.getParameter("take_time");
            String return_time = request.getParameter("return_time");
            float order_amount = Float.parseFloat(request.getParameter("order_amount"));
            String order_state = request.getParameter("order_state");
            float take_oil = Float.parseFloat(request.getParameter("take_oil"));
            float return_oil = Float.parseFloat(request.getParameter("return_oil"));
            float oil_amount = Float.parseFloat(request.getParameter("oil_amount"));
            String order_time = request.getParameter("order_time");

            if (return_shop.length() == 0) {
                return_shop = null;
                if (order_state.equals("已还车") || order_state.equals("已完成")) {
                    order_state = null;
                }
            }
            if (return_time.length() == 0) {
                return_time = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car.order_info set user_phone = ?, car_number = ?, take_shop = ?, return_shop = ?, take_time = ?, return_time = ?, order_amount = ?, order_state = ?, take_oil = ?, return_oil = ?, oil_amount = ?, order_time = ? where order_number = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, user_phone);
            ps.setString(2, car_number);
            ps.setString(3, take_shop);
            ps.setString(4, return_shop);
            ps.setString(5, take_time);
            ps.setString(6, return_time);
            ps.setFloat(7, order_amount);
            ps.setString(8, order_state);
            ps.setFloat(9, take_oil);
            ps.setFloat(10, return_oil);
            ps.setFloat(11, oil_amount);
            ps.setString(12, order_time);
            ps.setString(13, order_number);
            ps.executeUpdate();

            //如果订单状态变化，相应的汽车状态也会发生变化
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
            //如果出错，向网页返回错误信息
            out.println(e);
            out.close();
            e.printStackTrace();
        }

        //如果成功，向网页返回“0”
        out.println(0);
        out.close();
    }
}
