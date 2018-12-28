package Servlets;

import Classes.CarType;
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

//查找汽车类型的 Servlet
public class SearchCarTypeServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        //将数据库查询到的数据存储在 ArrayList 中，再将 ArrayList 转换为 JSONArray，最后输出到网页中由 Ajax 进行解析
        ArrayList<CarType> list = new ArrayList<>();
        try {
            Connection conn = DatabaseInit.getConnection();
            String car_name = request.getParameter("car_name");
            String sql = "select * from car.car_type where car_name = ? order by car_name;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, car_name);

            ResultSet rs = ps.executeQuery();

            CarTypeServlet.getList(list, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        JSONArray json = JSONArray.fromObject(list);

        PrintWriter out = response.getWriter();
        out.println(json);
        out.close();
    }
}
