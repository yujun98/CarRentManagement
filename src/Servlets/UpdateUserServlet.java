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

public class UpdateUserServlet extends HttpServlet {
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
            float balance = Float.parseFloat(request.getParameter("balance"));
            float deposit = Float.parseFloat(request.getParameter("deposit"));
            float score = Float.parseFloat(request.getParameter("score"));

            if (id.length() == 0) {
                id = null;
            }

            Connection conn = DatabaseInit.getConnection();
            String sql = "update car.user set user_name = ?, user_pwd = ?, id = ?, balance = ?, deposit = ?, score = ? where user_phone = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, user_name);
            ps.setString(2, user_pwd);
            ps.setString(3, id);
            ps.setFloat(4, balance);
            ps.setFloat(5, deposit);
            ps.setFloat(6, score);
            ps.setString(7, user_phone);
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
