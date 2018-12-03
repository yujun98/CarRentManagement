package Classes;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseInit {
    private static final String url = "jdbc:mysql://localhost:3306/";
    private static final String username = "root";
    private static final String password = "Intheforest37";

    public static Connection getConnection(){
        Connection connection = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return connection;
    }
}
