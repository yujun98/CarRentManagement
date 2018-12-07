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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class CarServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        ArrayList<Car> list=new ArrayList<>();
        try {
            Connection conn= DatabaseInit.getConnection();
            String sql="select * from car.car order by car_number;";
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(sql);

            getList(list, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        JSONArray json = JSONArray.fromObject(list);

        PrintWriter out = response.getWriter();
        out.println(json);
        out.close();
    }

    static void getList(ArrayList<Car> list, ResultSet rs) throws SQLException {
        while(rs.next())
        {
            Car c = new Car();
            c.setCar_number(rs.getString("car_number"));
            c.setPlate_number(rs.getString("plate_number"));
            c.setCar_name(rs.getString("car_name"));
            c.setCar_state(rs.getString("car_state"));
            c.setShop_number(rs.getString("shop_number"));
            list.add(c);
        }
    }
}
