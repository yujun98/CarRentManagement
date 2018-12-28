package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

//添加汽车类型的 Servlet
public class AddCarTypeServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        PrintWriter out = response.getWriter();

        try {
            String car_name = request.getParameter("car_name");
            String car_picture = request.getParameter("car_picture");
            String car_brand = request.getParameter("car_brand");
            String car_type = request.getParameter("car_type");
            float daily_rent = Float.parseFloat(request.getParameter("daily_rent"));
            float car_deposit = Float.parseFloat(request.getParameter("car_deposit"));

            Connection conn = DatabaseInit.getConnection();
            String sql = "insert into car.car_type(car_name, car_picture, car_brand, car_type, daily_rent, car_deposit) values (?, ?, ?, ?, ?, ?);";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_name);
            ps.setString(2, car_picture);
            ps.setString(3, car_brand);
            ps.setString(4, car_type);
            ps.setFloat(5, daily_rent);
            ps.setFloat(6, car_deposit);
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
