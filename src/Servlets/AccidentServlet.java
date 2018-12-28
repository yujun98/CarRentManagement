package Servlets;

import Classes.Accident;
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

//事故处理的 Servlet
public class AccidentServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        //创建 Accident 类型的 ArrayList
        ArrayList<Accident> list = new ArrayList<>();
        try {
            //连接数据库，进行查找操作
            Connection conn = DatabaseInit.getConnection();
            String sql = "select * from car.accident order by order_number;";
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
    static void getList(ArrayList<Accident> list, ResultSet rs) throws SQLException {
        while(rs.next())
        {
            Accident a = new Accident();
            a.setOrder_number(rs.getString("order_number"));
            a.setTime(rs.getString("time"));
            a.setPlace(rs.getString("place"));
            a.setType(rs.getString("type"));
            list.add(a);
        }
    }
}