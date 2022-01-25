<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head><title>FNM - Error</title></head>
<body>
<h2><c:out value="${requestScope.title}"/></h2>
<div class="message-box error-message"><c:out value="${requestScope.message}"/></div>
</body>
</html>
