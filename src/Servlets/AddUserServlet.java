package Servlets;

import Classes.DatabaseInit;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

public class AddUserServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doPost(request, response);
    }
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
        response.setCharacterEncoding("utf-8");

        String json;
        PrintWriter out = response.getWriter();

        try {
            String user_phone = request.getParameter("user_phone");
            String user_name = request.getParameter("user_name");
            String user_pwd = request.getParameter("user_pwd");
            String id = request.getParameter("id");
            int state = Integer.parseInt(request.getParameter("state"));
            int balance = Integer.parseInt(request.getParameter("balance"));
            int deposit = Integer.parseInt(request.getParameter("deposit"));
            int score = Integer.parseInt(request.getParameter("score"));

            if (user_phone.length() == 0) {
                user_phone = null;
            }
            if (user_name.length() == 0) {
                user_name = null;
            }
            if (user_pwd.length() == 0) {
                user_pwd = null;
            }
            if (id.length() == 0) {
                id = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "insert into car_rent.user(user_phone, user_name, user_pwd, id, state, balance, deposit, score) values (?, ?, ?, ?, ?, ?, ?, ?);";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, user_phone);
            ps.setString(2, user_name);
            ps.setString(3, user_pwd);
            ps.setString(4, id);
            ps.setInt(5, state);
            ps.setInt(6, balance);
            ps.setInt(7, deposit);
            ps.setInt(8, score);
            ps.executeUpdate();
        } catch (Exception e) {
            json = "{\"code\": \"1\"}";
            out.println(JSONObject.fromObject(json));
            out.close();
            e.printStackTrace();
        }

        json = "{\"code\": \"0\"}";
        out.println(JSONObject.fromObject(json));
        out.close();
    }
}
