Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
cmd = "cmd /c """ & scriptDir & "\start_todo.cmd""" 
shell.Run cmd, 0, False
