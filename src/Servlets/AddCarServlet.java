package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

//添加汽车信息的 Servlet
public class AddCarServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        PrintWriter out = response.getWriter();

        try {
            String car_number = request.getParameter("car_number");
            String plate_number = request.getParameter("plate_number");
            String car_name = request.getParameter("car_name");
            String car_state = request.getParameter("car_state");
            String shop_number = request.getParameter("shop_number");

            //连接数据库，进行添加操作
            Connection conn = DatabaseInit.getConnection();
            String firstSql = "select * from car.car where plate_number = ?";
            PreparedStatement firstPs = conn.prepareStatement(firstSql);
            firstPs.setString(1,plate_number);
            ResultSet firstRs = firstPs.executeQuery();
            if (firstRs.next()) {
                out.println("车牌号相同");
                out.close();
            }
            else {
                String sql = "insert into car.car(car_number, plate_number, car_name, car_state, shop_number) values (?, ?, ?, ?, ?);";
                PreparedStatement ps = conn.prepareStatement(sql);
                ps.setString(1, car_number);
                ps.setString(2, plate_number);
                ps.setString(3, car_name);
                ps.setString(4, car_state);
                ps.setString(5, shop_number);
                ps.executeUpdate();
            }
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
