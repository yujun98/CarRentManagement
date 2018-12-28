package Servlets;

import Classes.DatabaseInit;
import Classes.Order;
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

//订单处理的 Servlet
public class OrderServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        //创建 Order 类型的 ArrayList
        ArrayList<Order> list = new ArrayList<>();
        try {
            //连接数据库，进行查找操作
            Connection conn = DatabaseInit.getConnection();
            String sql = "select * from car.order_info order by order_number;";
            Statement st = conn.createStatement();
            ResultSet rs = st.executeQuery(sql);

            getList(list, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        //将 ArrayList 转化为 JSONArray
        JSONArray json = JSONArray.fromObject(list);

        PrintWriter out = response.getWriter();
        out.println(json);
        out.close();
    }

    //将进行数据库查找操作后的返回集中的信息依此添加到 ArrayList 中
    static void getList(ArrayList<Order> list, ResultSet rs) throws SQLException {
        while(rs.next())
        {
            Order o = new Order();
            o.setOrder_number(rs.getString("order_number"));
            o.setUser_phone(rs.getString("user_phone"));
            o.setCar_number(rs.getString("car_number"));
            o.setTake_shop(rs.getString("take_shop"));
            o.setReturn_shop(rs.getString("return_shop"));
            o.setTake_time(rs.getString("take_time"));
            o.setReturn_time(rs.getString("return_time"));
            o.setOrder_amount(rs.getInt("order_amount"));
            o.setOrder_state(rs.getString("order_state"));
            o.setTake_oil(rs.getInt("take_oil"));
            o.setReturn_oil(rs.getInt("return_oil"));
            o.setOil_amount(rs.getInt("oil_amount"));
            o.setOrder_time(rs.getString("order_time"));
            list.add(o);
        }
    }
}
