package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

//更新汽车类型的 Servlet
public class UpdateCarTypeServlet extends HttpServlet {
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
            String car_brand = request.getParameter("car_brand");
            String car_type = request.getParameter("car_type");
            float daily_rent = Float.parseFloat(request.getParameter("daily_rent"));
            float car_deposit = Float.parseFloat(request.getParameter("car_deposit"));

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car.car_type set car_brand = ?, car_type = ?, daily_rent = ?, car_deposit = ? where car_name = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_brand);
            ps.setString(2, car_type);
            ps.setFloat(3, daily_rent);
            ps.setFloat(4, car_deposit);
            ps.setString(5, car_name);
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
