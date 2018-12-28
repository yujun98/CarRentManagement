package Servlets;

import Classes.DatabaseInit;
import Classes.Shop;
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

//服务点处理的 Servlet
public class ShopServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        //创建 Shop 类型的 ArrayList
        ArrayList<Shop> list = new ArrayList<>();
        try {
            //连接数据库，进行查找操作
            Connection conn = DatabaseInit.getConnection();
            String sql = "select * from car.shop order by shop_number;";
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
    static void getList(ArrayList<Shop> list, ResultSet rs) throws SQLException {
        while(rs.next())
        {
            Shop s = new Shop();
            s.setShop_number(rs.getString("shop_number"));
            s.setShop_city(rs.getString("shop_city"));
            s.setShop_area(rs.getString("shop_area"));
            s.setShop_name(rs.getString("shop_name"));
            s.setShop_address(rs.getString("shop_address"));
            s.setShop_phone(rs.getString("shop_phone"));
            s.setShop_hours(rs.getString("shop_hours"));
            list.add(s);
        }
    }
}
