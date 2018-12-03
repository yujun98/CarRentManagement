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

public class ShopServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        ArrayList<Shop> list=new ArrayList<>();
        try {
            Connection conn = DatabaseInit.getConnection();
            String sql = "select * from car_rent.shop order by shop_number;";
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

    static void getList(ArrayList<Shop> list, ResultSet rs) throws SQLException {
        while(rs.next())
        {
            Shop s = new Shop();
            s.setShop_number(rs.getString("shop_number"));
            s.setShop_city(rs.getString("shop_city"));
            s.setShop_name(rs.getString("shop_name"));
            s.setShop_address(rs.getString("shop_address"));
            s.setShop_phone(rs.getString("shop_phone"));
            s.setShop_hours(rs.getString("shop_hours"));
            s.setShop_area(rs.getString("shop_area"));
            list.add(s);
        }
    }
}
