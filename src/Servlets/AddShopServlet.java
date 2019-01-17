package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

//添加服务点信息的 Servlet
public class AddShopServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        PrintWriter out = response.getWriter();

        try {
            String shop_number = request.getParameter("shop_number");
            String shop_prov = request.getParameter("shop_prov");
            String shop_city = request.getParameter("shop_city");
            String shop_area = request.getParameter("shop_area");
            String shop_name = request.getParameter("shop_name");
            String shop_address = request.getParameter("shop_address");
            String shop_phone = request.getParameter("shop_phone");
            String shop_hours = request.getParameter("shop_hours");
            String where;
            if (!shop_prov.equals(shop_city))
                where = shop_prov + shop_city;
            else
                where = shop_city;

            //连接数据库，进行添加操作
            Connection conn = DatabaseInit.getConnection();
            String sql = "insert into car.shop(shop_number, shop_city, shop_area, shop_name, shop_address, shop_phone, shop_hours) values (?, ?, ?, ?, ?, ?, ?);";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, shop_number);
            ps.setString(2, where);
            ps.setString(3, shop_area);
            ps.setString(4, shop_name);
            ps.setString(5, shop_address);
            ps.setString(6, shop_phone);
            ps.setString(7, shop_hours);
            ps.executeUpdate();
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
