package Classes;

//服务点类
public class Shop {
    //服务点编号
    private String shop_number;
    //服务点所在城市
    private String shop_city;
    //营业区
    private String shop_area;
    //服务点名称
    private String shop_name;
    //服务点地址
    private String shop_address;
    //服务点联系电话
    private String shop_phone;
    //服务点营业时间
    private String shop_hours;

    public void setShop_number(String shop_number) {
        this.shop_number = shop_number;
    }
    public void setShop_city(String shop_city) {
        this.shop_city = shop_city;
    }
    public void setShop_area(String shop_area) {
        this.shop_area = shop_area;
    }
    public void setShop_name(String shop_name) {
        this.shop_name = shop_name;
    }
    public void setShop_address(String shop_address) {
        this.shop_address = shop_address;
    }
    public void setShop_phone(String shop_phone) {
        this.shop_phone = shop_phone;
    }
    public void setShop_hours(String shop_hours) {
        this.shop_hours = shop_hours;
    }

    public String getShop_number() {
        return shop_number;
    }
    public String getShop_city() {
        return shop_city;
    }
    public String getShop_area() {
        return shop_area;
    }
    public String getShop_name() {
        return shop_name;
    }
    public String getShop_address() {
        return shop_address;
    }
    public String getShop_phone() {
        return shop_phone;
    }
    public String getShop_hours() {
        return shop_hours;
    }
}
