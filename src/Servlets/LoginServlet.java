package Servlets;

import Classes.DatabaseInit;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

//登录验证的 Servlet
public class LoginServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        // 设置编码为 utf-8
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        // 获取用户名和密码
        String name = request.getParameter("name");
        String password = request.getParameter("password");
        String manager_pwd = null;

        try {
            Connection conn = DatabaseInit.getConnection();
            String sql = "select * from car.manager where manager_id = ?;";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, name);
            ResultSet rs = ps.executeQuery();
            //ResultSet 是个结果集。不能直接取记录的信息。需要循环遍历，哪怕结果集返回的只有一条记录。
            while (rs.next()) {
                manager_pwd = rs.getString("manager_pwd");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        //校验用户名和密码是否正确
        if (manager_pwd != null && manager_pwd.equals(password)) {
            //获取 session
            HttpSession session = request.getSession();
            //将用户名保存在 session 中
            session.setAttribute("name", name);
            response.sendRedirect("index.html");
        } else {
            //校验不成功，则跳转到 login.html 页面
            response.setContentType("text/html;charset=utf-8");
            PrintWriter pw=response.getWriter();
            pw.write("<script language='javascript'>alert('请输入正确的用户名密码');window.location.href='login.html'</script>");
        }
    }
}
