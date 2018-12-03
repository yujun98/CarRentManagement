package Servlets;

import Classes.Car;
import Classes.DatabaseInit;
import net.sf.json.JSONArray;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class SearchCarServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        ArrayList<Car> list = new ArrayList<>();
        try {
            Connection conn = DatabaseInit.getConnection();
            String car_number = request.getParameter("car_number");
            String sql = "select * from car_rent.car where car_number = ? order by car_number;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_number);

            ResultSet rs = ps.executeQuery();

            CarServlet.getList(list, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        JSONArray json = JSONArray.fromObject(list);

        PrintWriter out = response.getWriter();
        out.println(json);
        out.close();
    }
}
