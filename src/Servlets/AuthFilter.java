package Servlets;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

//对未登录用户进行过滤的 Filter
public class AuthFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest rq = (HttpServletRequest) servletRequest;
        HttpServletResponse rp = (HttpServletResponse) servletResponse;

        //获取路径
        //request.getRequestURL()   http://localhost:8080/management/login.html
        //request.getRequestURI()   /management/login.html
        //request.getContextPath()  /management
        String myURI = rq.getRequestURI();

        if (!((rq.getContextPath() + "/login.html").equals(myURI) || (rq.getContextPath() + "/").equals(myURI))) {
            HttpSession session = rq.getSession(false);
            //当用户访问除登录页面外的其它页面时，如果用户未登录则让其放回到登录页面
            if (session == null || session.getAttribute("name") == null) {
                rp.setContentType("text/html;charset=UTF-8");
                rp.getWriter().write("尚未登录，将跳转到登录页面！");
                rp.setHeader("refresh", "3;url=" + rq.getContextPath() + "/login.html");
                return;
            }
        }

        filterChain.doFilter(rq, rp);
    }
}
