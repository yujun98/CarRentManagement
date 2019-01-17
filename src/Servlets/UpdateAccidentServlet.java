package Servlets;

import Classes.DatabaseInit;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

//更新事故记录的 Servlet
public class UpdateAccidentServlet extends HttpServlet {
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
            String time = request.getParameter("time");
            String place = request.getParameter("place");
            String type = request.getParameter("type");

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car.accident set place = ?, type = ? where order_number = ? and time = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, place);
            ps.setString(2, type);
            ps.setString(3, order_number);
            ps.setString(4, time);
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
